
export interface EmailRequestBody {
  email: string;
  clientName?: string;
  mentorName?: string;
  mentorCompany?: string;
  registerUrl?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  service?: string;
  error?: any;
}
