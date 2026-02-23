import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { ZabbixHistory, AppStat } from './types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const INTERVALO_COLETA = 30; 

const identificarApp = (rawString: string): string => {
  if (!rawString) return "DESCONHECIDO";
  const s = rawString.toUpperCase().trim();
  if (s === "INATIVO" || s === "PARADO" || s === "IDLE" || s === "WINDOWSTERMINAL") return "😴 INATIVO / SISTEMA";
  return s;
};

app.get('/students', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(process.env.ZABBIX_URL!, {
      jsonrpc: "2.0",
      method: "host.get",
      params: { 
        output: ["hostid", "name"],
        selectInterfaces: ["ip"] 
      },
      auth: process.env.ZABBIX_TOKEN, 
      id: 1
    });
    res.json(response.data.result);
  } catch (error: any) {
    console.error("Erro ao buscar hosts:", error.message);
    res.status(500).json({ error: "Erro ao listar alunos" });
  }
});

app.get('/stats/:hostid', async (req: Request, res: Response) => {
  const { hostid } = req.params;
  const { periodo } = req.query;

  const agora = Math.floor(Date.now() / 1000);
  let timeFrom: number;

  const hojeMeiaNoite = new Date();
  hojeMeiaNoite.setHours(0, 0, 0, 0);

  switch (periodo) {
    case 'semana': timeFrom = agora - (7 * 24 * 3600); break;
    case 'mes': timeFrom = agora - (30 * 24 * 3600); break;
    default: timeFrom = Math.floor(hojeMeiaNoite.getTime() / 1000);
  }

  try {
    // 1. Busca o item pela Key app.active
    const itemRes = await axios.post(process.env.ZABBIX_URL!, {
      jsonrpc: "2.0",
      method: "item.get",
      params: { 
        hostids: hostid, 
        filter: { key_: "app.active" }, 
        output: ["itemid", "name"]
      },
      auth: process.env.ZABBIX_TOKEN,
      id: 1
    });

    const item = itemRes.data.result[0];
    if (!item) return res.status(404).json({ error: "Monitoramento app.active não encontrado" });

    // 2. Busca histórico
    const historyRes = await axios.post(process.env.ZABBIX_URL!, {
      jsonrpc: "2.0",
      method: "history.get",
      params: { 
        itemids: item.itemid, 
        time_from: timeFrom, 
        history: 4, 
        sortfield: "clock",
        sortorder: "DESC"
      },
      auth: process.env.ZABBIX_TOKEN,
      id: 2
    });

    const history: ZabbixHistory[] = historyRes.data.result;
    console.log(`[LOG] Host: ${hostid} | Registros: ${history.length}`);

    const statsMap = new Map<string, number>();
    history.forEach((entry) => {
      const appName = identificarApp(entry.value);
      statsMap.set(appName, (statsMap.get(appName) || 0) + INTERVALO_COLETA);
    });

    const ranking: AppStat[] = Array.from(statsMap.entries())
      .map(([name, sec]) => ({
        name,
        seconds: sec,
        timeDisplay: sec < 60 ? `${sec}s` : `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`
      }))
      .sort((a, b) => b.seconds - a.seconds);

    const totalSeconds = ranking.reduce((acc, curr) => acc + curr.seconds, 0);

    res.json({ 
      periodo: periodo || 'dia', 
      total_time: `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m`,
      ranking 
    });

  } catch (error: any) {
    res.status(500).json({ error: "Erro na API Zabbix" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));