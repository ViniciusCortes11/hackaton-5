
export interface UserAccount {
  matricula: string;
  senha: string;
  nome: string;
  curso: string;
  periodo: number;
  tipo: "mentor" | "mentorado";
}

export interface Review {
  id: string;
  mentorId: string;
  autor: string;
  nota: number;
  comentario: string;
  data: string;
}

const USERS_KEY = "mentoris_users";
const REVIEWS_KEY = "mentoris_reviews";

export function getUsers(): UserAccount[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: UserAccount) {
  const users = getUsers();

  const exists = users.find((u) => u.matricula === user.matricula);

  if (!exists) {
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export function authenticate(
  matricula: string,
  senha: string,
) {
  const users = getUsers();

  return users.find(
    (u) =>
      u.matricula === matricula &&
      u.senha === senha,
  );
}

export function getReviews(): Review[] {
  const data = localStorage.getItem(REVIEWS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveReview(review: Review) {
  const reviews = getReviews();
  reviews.unshift(review);

  localStorage.setItem(
    REVIEWS_KEY,
    JSON.stringify(reviews),
  );
}
