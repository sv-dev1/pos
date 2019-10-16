import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchProducts'
})
export class SearchProductsPipe implements PipeTransform {

    transform(backupProductdata, searchText: string): any[] {
      
        if (!backupProductdata) return [];
        if (!searchText) return backupProductdata;
        searchText = searchText;
        return backupProductdata.filter(it => {
            // return it.toString().includes(searchText);
            const builderId = it.itemName.toLowerCase().includes(searchText.toLowerCase())
            const groupName = it.sku.toLowerCase().includes(searchText.toLowerCase())
            const itemprice = it.itemSalePrice.toString().includes(searchText.toLowerCase())
            if (it.barcode && it.barcode.toLowerCase().includes(searchText.toLowerCase())) {
                return true;
              }
            // const barcode = it.barcode.toLowerCase().includes(searchText.toLowerCase())

            // const companyPersonName = it.companyPersonName.toLowerCase().includes(searchString.toLowerCase())

            return (builderId + groupName + itemprice);
        });
    }

}