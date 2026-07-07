import { auth } from "@/shared/lib/auth";
import { toNodeHandler } from "better-auth/node";

export const GET = toNodeHandler(auth);
export const POST = toNodeHandler(auth);
