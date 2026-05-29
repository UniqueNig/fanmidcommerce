import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    image: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const teamMemberModel =
  mongoose.models["fanmidcommerce-team"] ||
  mongoose.model("fanmidcommerce-team", teamMemberSchema);

export default teamMemberModel;
