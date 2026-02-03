import { callApi } from "@/app/commonApi.js";

export async function saveBankBranchDetails(
  bank_id,
  ifsc_code,
  branch_name,
  entry_user_id,
) {
  try {
    const response = await callApi("saveBankBranchDetails", {
      "bank_id": bank_id,
      "ifsc_code": ifsc_code,
      "branch_name": branch_name,
      "entry_user_id": entry_user_id
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
