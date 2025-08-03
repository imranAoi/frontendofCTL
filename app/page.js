import Header from "../components/Header/Header";
import Hero from "../components/Home/Hero";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <main>
        <Header />
        <Hero />
      </main>
    </ProtectedRoute>
  );
}