declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module './App' {
  const App: React.FC;
  export default App;
}
