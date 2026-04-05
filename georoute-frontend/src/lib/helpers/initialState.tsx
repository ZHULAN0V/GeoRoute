import type { IPath } from "../../services/types/Path";

interface IPathsObject { [index: string]: IPath; }

export const initialId = crypto.randomUUID();
export const initialVariantId = crypto.randomUUID();

export const initialStateRedux: IPathsObject = ({})