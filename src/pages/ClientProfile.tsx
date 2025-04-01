
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientLayout from "@/components/client/ClientLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";

// Dados para o gráfico de perfil comportamental
const profileData = [
  { name: "Analítico", value: 75 },
  { name: "Comunicador", value: 60 },
  { name: "Executor", value: 45 },
  { name: "Planejador", value: 80 },
];

// Dados para características comportamentais
const traitsData = [
  { subject: "Comunicação", A: 80, fullMark: 100 },
  { subject: "Liderança", A: 65, fullMark: 100 },
  { subject: "Proatividade", A: 90, fullMark: 100 },
  { subject: "Trabalho em Equipe", A: 70, fullMark: 100 },
  { subject: "Resiliência", A: 75, fullMark: 100 },
  { subject: "Inteligência Emocional", A: 85, fullMark: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ClientProfile = () => {
  return (
    <ClientLayout title="Perfil Comportamental">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seu Perfil Dominante</CardTitle>
            <CardDescription>
              Baseado nos testes comportamentais realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profileData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {profileData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Perfil Predominante: Planejador</h3>
              <p className="text-sm text-gray-700">
                Pessoas com perfil planejador são organizadas, metódicas e priorizam estrutura e processos. 
                Possuem excelente capacidade analítica e atenção aos detalhes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características Comportamentais</CardTitle>
            <CardDescription>
              Análise detalhada de suas competências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={traitsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="João Silva" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Destaque: Proatividade</h3>
              <p className="text-sm text-gray-700">
                Você demonstra alta capacidade de iniciativa e antecipação de problemas, 
                características muito valorizadas em ambientes dinâmicos.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recomendações de Desenvolvimento</CardTitle>
            <CardDescription>
              Baseadas no seu perfil comportamental atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Equilíbrio entre Planejamento e Execução</h3>
                <p className="text-sm text-gray-700">
                  Seu perfil planejador é um grande diferencial, mas pode se beneficiar desenvolvendo 
                  mais características executoras para implementar suas ideias com maior rapidez.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Desenvolvimento de Liderança</h3>
                <p className="text-sm text-gray-700">
                  Sugerimos foco em habilidades de liderança para complementar suas fortes 
                  capacidades analíticas e de planejamento.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cursos Recomendados</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Liderança Situacional</li>
                  <li>Metodologias Ágeis para Gestão</li>
                  <li>Inteligência Emocional Aplicada</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientProfile;
