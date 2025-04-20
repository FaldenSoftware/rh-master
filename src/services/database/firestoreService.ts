// src/services/database/firestoreService.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore, collection, doc, getDoc, setDoc, updateDoc,
  query, where, getDocs, addDoc, deleteDoc, FieldValue,
  orderBy, limit, startAfter, endBefore, startAt, endAt, // Pagination
  DocumentData, QuerySnapshot, QueryDocumentSnapshot, DocumentSnapshot
} from 'firebase/firestore';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, User as FirebaseAuthUser // Importa o tipo User do Firebase Auth
} from 'firebase/auth';

import { DatabaseService, User, UserProfile, Client, Invite, TestResult } from './index';
import { FirebaseConfig } from '../../config'; // Importe as configurações

// Garante que o Firebase só é inicializado uma vez
const app = !getApps().length ? initializeApp(FirebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);


export class FirestoreService implements DatabaseService {
  // Métodos de Autenticação
  async signIn(email: string, password: string): Promise<User | null> {
    console.log('FirestoreService: signIn');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return { id: user.uid, email: user.email || '' }; // Adapta para o tipo User
    } catch (error) {
      console.error('Firebase signIn error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<User | null> {
    console.log('FirestoreService: signUp');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Após criar o usuário, crie o perfil
      if (user) {
        await this.createUserProfile(user.uid, {
          ...userData,
          id: user.uid,
          email: user.email || '', // Garante que o email esteja presente
          name: userData.name || '',
          role: userData.role || 'client',
          created_at: new Date()
        } as UserProfile); // Força o tipo
        return { id: user.uid, email: user.email || '' }; // Adapta para o tipo User
      }
      return null;
    } catch (error) {
      console.error('Firebase signUp error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    console.log('FirestoreService: signOut');
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signOut error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('FirestoreService: getCurrentUser');
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Cancela o listener após a primeira execução
        if (user) {
          resolve({ id: user.uid, email: user.email || '' });
        } else {
          resolve(null);
        }
      }, reject);
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    console.log('FirestoreService: onAuthStateChanged listener attached');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ id: user.uid, email: user.email || '' });
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }

  // Métodos para Perfis
  async createUserProfile(userId: string, data: UserProfile): Promise<void> {
    console.log('FirestoreService: createUserProfile', userId);
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, data);
    } catch (error) {
      console.error('Firebase createUserProfile error:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    console.log('FirestoreService: getUserProfile', userId);
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        console.warn('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Firebase getUserProfile error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
    console.log('FirestoreService: updateUserProfile', userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
      // Após a atualização, obtém o perfil atualizado
      return await this.getUserProfile(userId);
    } catch (error) {
      console.error('Firebase updateUserProfile error:', error);
      throw error;
    }
  }

  // Métodos para Mentores e Clientes
  async getMentorClients(mentorId: string): Promise<Client[]> {
    console.log('FirestoreService: getMentorClients', mentorId);
    try {
      const clientsRef = collection(db, `users/${mentorId}/clients`);
      const q = query(clientsRef);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          client_id: doc.id,
          name: data.name,
          email: data.email,
          joined_at: data.joined_at,
          last_test_date: data.last_test_date,
          test_count: data.test_count
        } as Client;
      });
    } catch (error) {
      console.error('Firebase getMentorClients error:', error);
      throw error;
    }
  }

  // Métodos para Convites
  async createInvite(inviteData: Omit<Invite, 'id' | 'created_at' | 'accepted_at' | 'email_sent'>): Promise<Invite> {
    console.log('FirestoreService: createInvite');
    try {
      const invitesRef = collection(db, 'invites');
      const docRef = await addDoc(invitesRef, {
        ...inviteData,
        created_at: FieldValue.serverTimestamp(), // Use server timestamp
        email_sent: false
      });
      // Após criar, obtém o convite para retornar
      const inviteSnap = await getDoc(doc(db, 'invites', docRef.id));
      if (inviteSnap.exists()) {
        return {
          id: inviteSnap.id,
          ...(inviteSnap.data() as Omit<Invite, 'id'>)
        } as Invite;
      } else {
        throw new Error('Failed to create invite');
      }
    } catch (error) {
      console.error('Firebase createInvite error:', error);
      throw error;
    }
  }

  async sendInviteEmail(inviteId: string): Promise<void> {
    console.log('FirestoreService: sendInviteEmail (Not Implemented)');
    // Implemente o envio de email aqui (usando Cloud Functions, SendGrid, etc.)
    // ...
    console.warn('sendInviteEmail NÃO IMPLEMENTADO');
  }

  async getInvitesByMentor(mentorId: string, status?: Invite['status']): Promise<Invite[]> {
    console.log('FirestoreService: getInvitesByMentor', mentorId, status);
    try {
      const invitesRef = collection(db, 'invites');
      let q = query(invitesRef, where('mentor_id', '==', mentorId));
      if (status) {
        q = query(q, where('status', '==', status));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          name: data.name,
          status: data.status,
          mentor_id: data.mentor_id,
          mentor_name: data.mentor_name,
          email_sent: data.email_sent,
          created_at: data.created_at,
          accepted_at: data.accepted_at,
          token: data.token
        } as Invite;
      });
    } catch (error) {
      console.error('Firebase getInvitesByMentor error:', error);
      throw error;
    }
  }

  async getInviteByToken(token: string): Promise<Invite | null> {
    console.log('FirestoreService: getInviteByToken');
    try {
      const invitesRef = collection(db, 'invites');
      const q = query(invitesRef, where('token', '==', token));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          name: data.name,
          status: data.status,
          mentor_id: data.mentor_id,
          mentor_name: data.mentor_name,
          email_sent: data.email_sent,
          created_at: data.created_at,
          accepted_at: data.accepted_at,
          token: data.token
        } as Invite;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Firebase getInviteByToken error:', error);
      throw error;
    }
  }

  async acceptInvite(inviteId: string, clientId: string): Promise<void> {
    console.log('FirestoreService: acceptInvite', inviteId, clientId);
    try {
      const inviteRef = doc(db, 'invites', inviteId);
      await updateDoc(inviteRef, {
        status: 'accepted',
        accepted_at: FieldValue.serverTimestamp()
      });
      //TODO: link mentor and client
    } catch (error) {
      console.error('Firebase acceptInvite error:', error);
      throw error;
    }
  }

  // Métodos para Resultados de Testes
  async saveTestResult(resultData: Omit<TestResult, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    console.log('FirestoreService: saveTestResult');
    try {
      const testResultsRef = collection(db, 'test_results');
      const docRef = await addDoc(testResultsRef, {
        ...resultData,
        created_at: FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Firebase saveTestResult error:', error);
      throw error;
    }
  }

  async getUserTestResults(userId: string): Promise<TestResult[]> {
    console.log('FirestoreService: getUserTestResults', userId);
    try {
      const testResultsRef = collection(db, 'test_results');
      const q = query(testResultsRef, where('user_id', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          user_id: data.user_id,
          client_test_id: data.client_test_id,
          scores: data.scores,
          predominant_profile: data.predominant_profile,
          answers: data.answers,
          metadata: data.metadata,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as TestResult;
      });
    } catch (error) {
      console.error('Firebase getUserTestResults error:', error);
      throw error;
    }
  }

  async getTestResult(resultId: string): Promise<TestResult | null> {
    console.log('FirestoreService: getTestResult', resultId);
    try {
      const testResultRef = doc(db, 'test_results', resultId);
      const docSnap = await getDoc(testResultRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          user_id: data.user_id,
          client_test_id: data.client_test_id,
          scores: data.scores,
          predominant_profile: data.predominant_profile,
          answers: data.answers,
          metadata: data.metadata,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as TestResult;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Firebase getTestResult error:', error);
      throw error;
    }
  }
}
