export enum chains {
  phantom = "phantom",
}

export type State = {
  [key in chains]: string;
};
