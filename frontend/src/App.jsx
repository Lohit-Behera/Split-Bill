import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <h1 className="text-3xl text-center font-bold bg-primary">Splitter</h1>
    </ThemeProvider>
  );
}

export default App;
