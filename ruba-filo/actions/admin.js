"use server";


export async function getAdmin() {
    const {userId}=await auth();
}