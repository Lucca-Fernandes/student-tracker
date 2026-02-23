import { useState, useEffect } from 'react';
import { statsApi } from './services/zabbixService'; 
import { Modal } from './components/ui/Modal';
import { AlertCard } from './features/dashboard/components/AlertCard';
import { AppReport } from './features/dashboard/components/AppReport';

export default function App() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [reportData, setReportData] = useState<{ranking: any[], total_time: string}>({ ranking: [], total_time: "0h 0m" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    statsApi.getStudents().then((res: any[]) => setStudents(res));
  }, []);

  const loadReport = async (hostid: string, periodo: string = 'dia') => {
    setLoading(true);
    try {
      const data = await statsApi.getStudentStats(hostid, periodo);
      setReportData(data);
    } catch (e) { 
      console.error("Erro ao buscar relatório:", e); 
    }
    setLoading(false);
  };

  const handleOpenModal = (student: any) => {
    setSelectedStudent(student);
    loadReport(student.hostid);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white font-sans">
      <h1 className="text-3xl font-black mb-8 italic text-blue-500">ZABMONITOR_v2</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {students.map(s => (
          <AlertCard 
            key={s.hostid} 
            studentName={s.name} 
            daysInactive={0} 
            onClick={() => handleOpenModal(s)} 
          />
        ))}
      </div>

      {selectedStudent && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedStudent(null)} 
          title={`RELATÓRIO: ${selectedStudent.name}`}
        >
          {loading ? (
            <div className="p-10 text-center animate-pulse">SOLICITANDO DADOS AO BACKEND...</div>
          ) : (
            <AppReport 
              totalTime={reportData.total_time} 
              ranking={reportData.ranking}
              onPeriodChange={(p) => loadReport(selectedStudent.hostid, p)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}