import "./index.css";
import { WelcomeDataComponent } from "./components/UserDataDisplay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeDataComponent />
    </QueryClientProvider>
  );
}

export default App;
