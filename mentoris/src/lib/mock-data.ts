// Mock data for Mentoris UI prototype
export type ProfileType = "mentor" | "mentorado";

export type Mentor = {
  id: string;
  nome: string;
  curso: string;
  periodo: number;
  disciplinas: string[];
  descricao: string;
  experiencia: string;
  disponibilidade: string[];
  avaliacao: number;
  alunos: number;
  mentorias: number;
  avatar: string;
};

export type Mentoria = {
  id: string;
  mentorId: string;
  mentorNome: string;
  mentoradoNome: string;
  disciplina: string;
  data: string; // ISO
  horario: string;
  status: "Pendente" | "Confirmada" | "Concluída" | "Cancelada";
};

export type Mensagem = {
  id: string;
  de: "eu" | "outro";
  texto: string;
  hora: string;
  tipo?: "texto" | "link" | "material";
};

export type Conversa = {
  id: string;
  nome: string;
  curso: string;
  avatar: string;
  ultima: string;
  naoLidas: number;
  mensagens: Mensagem[];
};

export type Avaliacao = {
  id: string;
  mentorId: string;
  autor: string;
  nota: number;
  comentario: string;
  data: string;
};

const avatars = ["AS", "BC", "CL", "DM", "EN", "FO", "GP", "HQ", "IR", "JS"];
const cursos = [
  "Engenharia de Software",
  "Ciência da Computação",
  "Sistemas de Informação",
  "Engenharia Civil",
  "Administração",
  "Direito",
  "Medicina",
  "Psicologia",
];
const disciplinasPool = [
  "Cálculo I",
  "Cálculo II",
  "Álgebra Linear",
  "Estatística",
  "Programação Orientada a Objetos",
  "Estruturas de Dados",
  "Banco de Dados",
  "Engenharia de Software",
  "Redes de Computadores",
  "Sistemas Operacionais",
  "Física I",
  "Química Geral",
];
const nomesMentores = [
  "Ana Souza",
  "Bruno Carvalho",
  "Camila Lima",
  "Daniel Moreira",
  "Eduarda Nunes",
  "Felipe Oliveira",
  "Gabriela Pinto",
  "Henrique Queiroz",
  "Isabela Rocha",
  "João Silva",
];

export const mentors: Mentor[] = nomesMentores.map((nome, i) => ({
  id: `m${i + 1}`,
  nome,
  curso: cursos[i % cursos.length],
  periodo: 4 + (i % 6),
  disciplinas: [
    disciplinasPool[i % disciplinasPool.length],
    disciplinasPool[(i + 3) % disciplinasPool.length],
    disciplinasPool[(i + 5) % disciplinasPool.length],
  ],
  descricao:
    "Aluno dedicado, com experiência em monitorias e projetos acadêmicos. Gosto de explicar de forma clara e prática.",
  experiencia:
    "Monitor por 2 semestres, participação em iniciação científica e grupos de estudo.",
  disponibilidade: ["Seg 18h-20h", "Qua 19h-21h", "Sáb 10h-12h"],
  avaliacao: Math.round((4 + Math.random()) * 10) / 10,
  alunos: 8 + i * 3,
  mentorias: 12 + i * 4,
  avatar: avatars[i],
}));

export const mentorias: Mentoria[] = [
  {
    id: "s1",
    mentorId: "m1",
    mentorNome: "Ana Souza",
    mentoradoNome: "Você",
    disciplina: "Cálculo I",
    data: "2026-05-26",
    horario: "18:00",
    status: "Confirmada",
  },
  {
    id: "s2",
    mentorId: "m2",
    mentorNome: "Bruno Carvalho",
    mentoradoNome: "Você",
    disciplina: "Estruturas de Dados",
    data: "2026-05-28",
    horario: "19:30",
    status: "Pendente",
  },
  {
    id: "s3",
    mentorId: "m3",
    mentorNome: "Camila Lima",
    mentoradoNome: "Você",
    disciplina: "Banco de Dados",
    data: "2026-05-15",
    horario: "20:00",
    status: "Concluída",
  },
  {
    id: "s4",
    mentorId: "m4",
    mentorNome: "Daniel Moreira",
    mentoradoNome: "Você",
    disciplina: "Álgebra Linear",
    data: "2026-05-10",
    horario: "17:00",
    status: "Concluída",
  },
  {
    id: "s5",
    mentorId: "m5",
    mentorNome: "Eduarda Nunes",
    mentoradoNome: "Você",
    disciplina: "Programação OO",
    data: "2026-05-08",
    horario: "21:00",
    status: "Cancelada",
  },
];

export const conversas: Conversa[] = [
  {
    id: "c1",
    nome: "Ana Souza",
    curso: "Engenharia de Software",
    avatar: "AS",
    ultima: "Perfeito, te vejo segunda às 18h!",
    naoLidas: 2,
    mensagens: [
      { id: "1", de: "outro", texto: "Oi! Vi que você pediu mentoria de Cálculo I.", hora: "14:02" },
      { id: "2", de: "eu", texto: "Oi Ana! Sim, tenho dúvida em derivadas.", hora: "14:05" },
      { id: "3", de: "outro", texto: "Tranquilo, posso te explicar. Quer marcar segunda?", hora: "14:06" },
      { id: "4", de: "eu", texto: "Pode ser 18h?", hora: "14:08" },
      { id: "5", de: "outro", texto: "Material de apoio que uso:", hora: "14:09", tipo: "material" },
      { id: "6", de: "outro", texto: "Perfeito, te vejo segunda às 18h!", hora: "14:10" },
    ],
  },
  {
    id: "c2",
    nome: "Bruno Carvalho",
    curso: "Ciência da Computação",
    avatar: "BC",
    ultima: "Posso te enviar uns exercícios.",
    naoLidas: 0,
    mensagens: [
      { id: "1", de: "eu", texto: "Bruno, pode me ajudar com listas encadeadas?", hora: "09:30" },
      { id: "2", de: "outro", texto: "Claro! Posso te enviar uns exercícios.", hora: "09:32" },
    ],
  },
  {
    id: "c3",
    nome: "Camila Lima",
    curso: "Sistemas de Informação",
    avatar: "CL",
    ultima: "Obrigada pela mentoria!",
    naoLidas: 0,
    mensagens: [
      { id: "1", de: "eu", texto: "Obrigada pela mentoria!", hora: "ontem" },
      { id: "2", de: "outro", texto: "Sempre que precisar :)", hora: "ontem" },
    ],
  },
];

export const avaliacoes: Avaliacao[] = [
  { id: "a1", mentorId: "m1", autor: "Lucas P.", nota: 5, comentario: "Excelente, explicou de forma clara.", data: "2026-05-12" },
  { id: "a2", mentorId: "m1", autor: "Marina T.", nota: 5, comentario: "Muito paciente e atenciosa.", data: "2026-05-05" },
  { id: "a3", mentorId: "m1", autor: "Renato V.", nota: 4, comentario: "Boa mentoria, recomendo.", data: "2026-04-22" },
  { id: "a4", mentorId: "m2", autor: "Júlia M.", nota: 5, comentario: "Top demais!", data: "2026-05-10" },
];

export const mentoriasSemana = [
  { semana: "Sem 1", total: 2 },
  { semana: "Sem 2", total: 4 },
  { semana: "Sem 3", total: 3 },
  { semana: "Sem 4", total: 6 },
  { semana: "Sem 5", total: 5 },
  { semana: "Sem 6", total: 8 },
];

export const distribuicaoDisciplinas = [
  { disciplina: "Cálculo", total: 12 },
  { disciplina: "POO", total: 9 },
  { disciplina: "ED", total: 7 },
  { disciplina: "BD", total: 5 },
  { disciplina: "Redes", total: 3 },
];

export const recomendacoes = [
  { id: "r1", titulo: "Ana Souza", subtitulo: "Cálculo I • 4.9 ★", tipo: "mentor" },
  { id: "r2", titulo: "Revisar Estruturas de Dados", subtitulo: "Sugestão baseada no seu curso", tipo: "disciplina" },
  { id: "r3", titulo: "Mentoria amanhã às 18h", subtitulo: "Com Bruno Carvalho", tipo: "alerta" },
  { id: "r4", titulo: "Você participou de 6 mentorias este mês", subtitulo: "Acima da média!", tipo: "insight" },
];
