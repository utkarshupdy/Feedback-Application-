import { getServerSession } from "next-auth/next"; // gives session object from backend directly .. so that it doesnot relay on frontend
// getServerSession also require auth options to verify

import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    // const user: User = session?.user as User ........... if want to define types
    const user: User = session?.user as User 

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        } , {status: 401})
    }

    const userId = user?._id;
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessages},
            {new: true} //by using this , returned value is updated one
        )
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            } , {status: 401})
            
        }
        console.log(updatedUser);
        return Response.json({
            success: true,
            message: "Message accepting status is updated successfully",
            updatedUser
        } , {status: 202})
        
    } catch (error) {
        console.log("Failed to update user status to accept messages" , error)
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        } , {status: 500})
        
    }
}

// export async function GET(request: Request){
export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions);
    // const user: User = session?.user as User ........... if want to define types
    const user: User = session?.user as User 
    console.log(user);
    console.log(session);

    console.log(session?.user);

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        } , {status: 401})
    }

    try {
        const userId = user?._id;
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            } , {status: 404})
            
        }
        return Response.json({
            success: true,
            isAcceptingMessage : foundUser.isAcceptingMessage,
        } , {status: 202})
    } catch (error) {
        console.log("Error in getting message accepting messages" , error)
        return Response.json({
            success: false,
            message: "Error in getting message accepting messages"
        } , {status: 500})
        
    }
    

}



