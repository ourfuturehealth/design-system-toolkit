declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg?url' {
  const url: string;
  export default url;
}

declare module '*.svg?raw' {
  const content: string;
  export default content;
}
