import client from '@/db'
import authValues from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(){
    const session = await getServerSession(authValues)
    if(!session||!session.user){
        return NextResponse.json({
            msg:"Unauthorized"
        })
    }
    try{
        const response = await client.project.findMany({})
        return NextResponse.json(response)
    }
    catch(e){
        console.error(e)
        return NextResponse.json({
            msg:"Error occurred while fetching projects"
        })
    }
}