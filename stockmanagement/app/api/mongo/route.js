import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri =
    "mongodb+srv://ayush:ayush@stockmanagementsystem.o66z8wx.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db("stock");
    const collections = database.collection("inventory");
    const query = {};
    const collection = await collections.find(query).toArray();
    console.log(collection);
    return NextResponse.json({ a: 34, collection });
  } finally {
    await client.close();
  }
}
