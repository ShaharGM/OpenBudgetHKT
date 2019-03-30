export type muniDataKeys = | "name_municipality"
    | "index_socioeconomic_2013_rating_from_1_to_255_1_lowest_most"
    | "avg_students_per_class_total_2015_2014/15"
    | "balance_immigration_total_2015"
    | "cars_private_total_2015"
    | "births_live_2015"
    | "deaths_2015"
    | "income_avg_monthly_of_freelancers_in_2014_nis"
    | "index_inequality_employees_index_gini_0_equality_full_in_2014"
    | "jews_pct_2015"
    | "arab_pct_2015"
    | "muslim_pct_2015"
    | "druse_pct_2015"
    | "christian_pct_2015"
    | "total_population_end_2015_1000s"
    | "uses_land_number_all_area_jurisdiction_km2"
    | "total_expenses_of_municipality_budget_regular_1000s_nis_2015";

export type MuniKeyToNameMap = {
    [key in muniDataKeys]: string;
};

export const muniKeyToName: MuniKeyToNameMap = {
    "name_municipality": "שם המועצה",
    "index_socioeconomic_2013_rating_from_1_to_255_1_lowest_most": "מדד סוציואקונומי (2013)",
    "avg_students_per_class_total_2015_2014/15": "מספר תלמידים ממוצע בכיתות (2014 / 2015)",
    "balance_immigration_total_2015": "גידול/הגירה (2015)",
    "cars_private_total_2015": "מספר מכוניות פרטיות (2015)",
    "births_live_2015": "לידות (2015)",
    "deaths_2015": "נפטרים (2015)",
    "income_avg_monthly_of_freelancers_in_2014_nis": "שכר חודשי ממוצע לעצמאיים (2014)",
    "index_inequality_employees_index_gini_0_equality_full_in_2014": "מדד חוסר השוויון (2014)",
    "jews_pct_2015": "אחוז יהודים (2015)",
    "arab_pct_2015": "אחוז ערבים (2015)",
    "muslim_pct_2015": "אחוז מוסלמים (2015)",
    "druse_pct_2015": "אחוז דרוזים (2015)",
    "christian_pct_2015": "אחוז נוצרים (2015)",
    "total_population_end_2015_1000s": "גודל אוכלוסיה באלפים (סוף 2015)",
    "uses_land_number_all_area_jurisdiction_km2": "שטח",
    "total_expenses_of_municipality_budget_regular_1000s_nis_2015": "תקציב באלפים (2015)",
};