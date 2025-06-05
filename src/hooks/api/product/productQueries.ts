export interface GetByIdQuery {
    type: "GET_BY_ID";
    params: { productID: string };
}

export interface GetListByTemplateQuery {
    type: "GET_LIST_BY_TEMPLATE_ID";
    params: { 
        templateID: string; 
        conditionFilter: number;
        paging: {
            pagenum: number ;
            pageSize?: number;
        }
     };
}

// Thêm query mới

export type ProductQuery = GetByIdQuery | GetListByTemplateQuery;
// Mở rộng union type khi cần