declare module "$crown/components" {
  const components: Record<string, () => Promise<any>>;
  export default components;
}
