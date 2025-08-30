"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";

export async function getAdmin() {
    const {userId}=await auth();
    if (!userId) {
        throw new Error("unauthorized")
    }

    const user=await db.user.findUnique({
        where:{
            clerkUserId:userId
        }
    })

    if (!user || user.role !== "ADMIN") {
        return { authorized:false, reson: "not-admin"} 

    }
    return {authorized:true, user:user}
}