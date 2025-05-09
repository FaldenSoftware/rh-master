
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart as LineChartIcon, PieChart } from "lucide-react";
import LeaderLayout from "@/components/leader/LeaderLayout";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define interfaces for our data
interface ResultData {
  monthlyTestCount: Array<{ name: string; tests: number }>;
  profileDistribution: Array<{ name: string; value: number }>;
  testTypeData: Array<{ name: string; tests: number }>;
  skillAverages: Array<{ subject: string; value: number; fullMark: number }>;
}

// Interface to define the expected structure of the test result data
interface TestResultData {
  profile?: Array<{ name: string; value: number }>;
  category?: string;
  skills?: Array<{ skill: string; value: number }>;
  score?: number;
}

// Default empty data for charts
const DEFAULT_MONTHLY_DATA = [
  { name: "Jan", tests: 0 },
  { name: "Fev", tests: 0 },
  { name: "Mar", tests: 0 },
  { name: "Abr", tests: 0 },
  { name: "Mai", tests: 0 },
  { name: "Jun", tests: 0 }
];

const DEFAULT_PROFILE_DATA = [
  { name: "Analista", value: 0 },
  { name: "Executor", value: 0 },
  { name: "Comunicador", value: 0 },
  { name: "Planejador", value: 0 }
];

const DEFAULT_TEST_TYPE_DATA = [
  { name: "Comportamental", tests: 0 },
  { name: "Habilidades", tests: 0 },
  { name: "Conhecimento", tests: 0 },
  { name: "Aptidão", tests: 0 }
];

const DEFAULT_SKILL_DATA = [
  { subject: "Comunicação", value: 0, fullMark: 100 },
  { subject: "Liderança", value: 0, fullMark: 100 },
  { subject: "Proatividade", value: 0, fullMark: 100 },
  { subject: "Trabalho em Equipe", value: 0, fullMark: 100 },
  { subject: "Resiliência", value: 0, fullMark: 100 },
  { subject: "Inteligência Emocional", value: 0, fullMark: 100 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const LeaderResults = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<ResultData>({
    monthlyTestCount: DEFAULT_MONTHLY_DATA,
    profileDistribution: DEFAULT_PROFILE_DATA,
    testTypeData: DEFAULT_TEST_TYPE_DATA,
    skillAverages: DEFAULT_SKILL_DATA
  });
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetchResultsData();
  }, []);

  const fetchResultsData = async () => {
    setLoading(true);
    try {
      // Fetch all test results
      const { data: testResults, error: resultsError } = await supabase
        .from('test_results')
        .select('*, client_tests(*)');
      
      if (resultsError) throw resultsError;

      // Check if we have any data
      const hasTestResults = testResults && testResults.length > 0;
      setHasData(hasTestResults);

      // If no test results, return default data
      if (!hasTestResults) {
        console.log("No test results found, using default empty data");
        setResultData({
          monthlyTestCount: DEFAULT_MONTHLY_DATA,
          profileDistribution: DEFAULT_PROFILE_DATA,
          testTypeData: DEFAULT_TEST_TYPE_DATA,
          skillAverages: DEFAULT_SKILL_DATA
        });
        setLoading(false);
        return;
      }
      
      // Process data for monthly test counts
      const monthCounts: Record<string, number> = {};
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      
      // Initialize with past 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${monthNames[date.getMonth()]}`;
        monthCounts[monthKey] = 0;
      }
      
      // Count tests by month
      testResults.forEach(result => {
        if (result.client_tests?.completed_at) {
          const completedDate = new Date(result.client_tests.completed_at);
          const monthKey = `${monthNames[completedDate.getMonth()]}`;
          if (monthCounts[monthKey] !== undefined) {
            monthCounts[monthKey]++;
          }
        }
      });
      
      const monthlyTestCount = Object.entries(monthCounts).map(([name, tests]) => ({
        name,
        tests
      }));

      // Process profile distribution data
      const profileCounts: Record<string, number> = {
        "Analista": 0,
        "Executor": 0,
        "Comunicador": 0,
        "Planejador": 0
      };
      
      testResults.forEach(result => {
        // Typecast the data as TestResultData
        const resultData = result.data as TestResultData;
        
        if (resultData && resultData.profile) {
          resultData.profile.forEach(profile => {
            if (profileCounts[profile.name] !== undefined) {
              profileCounts[profile.name] += profile.value;
            }
          });
        }
      });
      
      const profileDistribution = Object.entries(profileCounts).map(([name, value]) => ({
        name,
        value: value || 0
      }));

      // Process test type data
      const typeCounts: Record<string, number> = {
        "Comportamental": 0,
        "Habilidades": 0,
        "Conhecimento": 0,
        "Aptidão": 0
      };
      
      testResults.forEach(result => {
        // Typecast the data as TestResultData
        const resultData = result.data as TestResultData;
        
        if (resultData && resultData.category) {
          const category = resultData.category;
          if (typeCounts[category] !== undefined) {
            typeCounts[category]++;
          } else if (category === "comportamental") {
            typeCounts["Comportamental"]++;
          } else if (category === "skills") {
            typeCounts["Habilidades"]++;
          } else if (category === "knowledge") {
            typeCounts["Conhecimento"]++;
          } else if (category === "aptitude") {
            typeCounts["Aptidão"]++;
          }
        } else {
          // Default to behavior if no category
          typeCounts["Comportamental"]++;
        }
      });
      
      const testTypeData = Object.entries(typeCounts).map(([name, tests]) => ({
        name,
        tests
      }));

      // Process skill averages for radar chart
      const skillTotals: Record<string, { total: number; count: number }> = {};
      
      testResults.forEach(result => {
        // Typecast the data as TestResultData
        const resultData = result.data as TestResultData;
        
        if (resultData && resultData.skills) {
          resultData.skills.forEach(skill => {
            if (!skillTotals[skill.skill]) {
              skillTotals[skill.skill] = { total: 0, count: 0 };
            }
            skillTotals[skill.skill].total += skill.value;
            skillTotals[skill.skill].count += 1;
          });
        }
      });
      
      let skillAverages = Object.entries(skillTotals)
        .map(([subject, { total, count }]) => ({
          subject,
          value: Math.round(total / count),
          fullMark: 100
        }))
        .slice(0, 6); // Take top 6 skills for radar chart
      
      // If no skills data, use default empty data
      if (skillAverages.length === 0) {
        skillAverages = DEFAULT_SKILL_DATA;
      }

      setResultData({
        monthlyTestCount,
        profileDistribution,
        testTypeData,
        skillAverages
      });
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
      // Use default data on error
      setResultData({
        monthlyTestCount: DEFAULT_MONTHLY_DATA,
        profileDistribution: DEFAULT_PROFILE_DATA,
        testTypeData: DEFAULT_TEST_TYPE_DATA,
        skillAverages: DEFAULT_SKILL_DATA
      });
      toast({
        title: "Informação",
        description: "Não há dados de resultados disponíveis ainda",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderNoDataMessage = () => {
    if (!loading && !hasData) {
      return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center text-gray-600">
            <LineChartIcon className="mr-2 h-5 w-5" />
            <span>Nenhum teste foi realizado ainda. Os gráficos mostrarão dados quando os testes forem completados.</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <LeaderLayout title="Resultados">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Visão Geral de Resultados</h1>
        
        {renderNoDataMessage()}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                Testes Realizados por Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-[300px]">Carregando...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={resultData.monthlyTestCount}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="tests" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Testes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-purple-500" />
                Distribuição de Perfis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-[300px]">Carregando...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={resultData.profileDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resultData.profileDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-green-500" />
                Testes por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-[300px]">Carregando...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={resultData.testTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tests" fill="#82ca9d" name="Quantidade" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Médias de Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-[300px]">Carregando...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius={80} data={resultData.skillAverages}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Médias" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LeaderLayout>
  );
};

export default LeaderResults;
