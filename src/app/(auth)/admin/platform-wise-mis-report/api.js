import { callApi } from "@/app/commonApi.js";
import Cookies from "react-cookies";;

export async function getAuthorityMISReport(
  login_user_id,
  from_date,
  to_date,
  gender_id = 0,
  perm_district_id = 0,
  perm_sub_division_id = 0,
  perm_pin_code = 0,
  grade_id = 0,
  occupation_type_id = 0,
  nature_of_industry_id = 0,
  organisation_id = "",
  age_group_id = 0,
  work_experience = 0,
  perm_block_municipality_corp_id = 0,
  perm_gp_ward_id = 0
) {
  try {
    const response = await callApi("getAuthorityMISReport", {
      login_user_id,
      from_date,
      to_date,
      gender_id,
      perm_district_id,
      perm_sub_division_id,
      perm_pin_code,
      grade_id,
      occupation_type_id,
      nature_of_industry_id,
      organisation_id: organisation_id ? JSON.stringify(organisation_id) : "",
      age_group_id,
      work_experience,
      perm_block_municipality_corp_id,
      perm_gp_ward_id
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}