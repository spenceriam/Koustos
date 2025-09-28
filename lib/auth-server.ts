import { createAuth } from "convex/auth";
import { getToken as getTokenNext } from "@convex-dev/better-auth/nextjs";

export const getToken = () => getTokenNext(createAuth);
