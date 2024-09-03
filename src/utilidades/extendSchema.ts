import mongoose, { Schema } from "mongoose";

export function extendSchema (Schema : Schema, definition : any, options? : any) {
    return new mongoose.Schema(
      Object.assign({}, Schema.obj, definition),
      options
    );
  }