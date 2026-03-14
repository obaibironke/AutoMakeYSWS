import { Switch, Route, Router as WouterRouter } from "wouter";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Showcase from "./pages/Showcase";
import ProjectDetail from "./pages/ProjectDetail";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <>
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/showcase" component={Showcase} />
          <Route path="/projects/:id" component={ProjectDetail} />
          <Route path="/guides" component={Guides} />
          <Route path="/guides/:id" component={GuideDetail} />
          <Route path="/shop" component={Shop} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
