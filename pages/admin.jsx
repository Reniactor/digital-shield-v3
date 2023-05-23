import NavBar from "./components/header";

const Admin = () => {
  return (
    <main className="bg-background-color-website min-h-screen min-w-screen flex items-center">
      <NavBar />
      <div>
        <form>
          <input type="number" />
        </form>
      </div>
    </main>
  );
};
export default Admin;
