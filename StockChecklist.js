var SellerCenterJs_StockChecklist = {
    selected: {},
    selectedData: {},
    isSelected(sku) {
        return (typeof this.selected[sku] !== "undefined")
            ? this.selected[sku]
            : false;
    },
    handleSelect(item) {
        this.toggleSelection(item);
    },
    stripName(name){
        return name
            .replace(' MURAH', '');
    },
    getVariation(sku){
        let splitted = sku.split('/');
        let variation = splitted[splitted.length - 1];
        if(variation.length > 15){
            return '';
        }
        return ` (${variation})`;
    },
    parseOrderNumbers(orders){
        let numbers = orders.split(', ');
        var toReturn = '';
        numbers.forEach((e) => {
            toReturn += `<a href="https://sellercenter.lazada.co.id/order/detail/${e}/29991" target="_blank">${e}</a><br>`;
        });
        return toReturn;
    },
    openSelected() {
        var items = '';
        var items_text = '';
        for (k in this.selected) {
            if (this.isSelected(this.selectedData[k].sku)) {
                let d = this.selectedData[k];
                let item_name = `${d.quantity}x ${this.stripName(d.name)}${this.getVariation(d.sku)}`;
                items_text += `${item_name}\n`;
                items += `<tr>
                    <th scope="row"><img width="120px" src="${d.image}"></th>
                    <td>${d.name}</td>
                    <td>${d.quantity}</td>
                    <td>${this.parseOrderNumbers(d.order)}</td>
                    <td><input style="width: 100%" type="text" value="${item_name}"></td>
                </tr>`;
            }
        }

        let pageHtmlTemplate = `<!DOCTYPE html><html><head> <title>SellerCenterJS - Stock Checklist Results</title> <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous"></head><body> <div class="container"> <div class="row"> <div class="col-12"> <div class="mx-auto"> <h1 class="text-center">SellerCenterJS - Stock Checklist Results</h1> </div></div></div><div class="row"> <div class="col-12"> <table class="table table-striped"> <thead> <tr> <th scope="col"  style="width: 10%">Image</th> <th scope="col" style="width: 20%">Name</th> <th scope="col" style="width: 10%">Quantity</th> <th scope="col" style="width: 15%">Order Number</th> <th scope="col">Formatted</th> </tr></thead> <tbody>
        ${items}
        </tbody> </table> </div></div><div class="row"> <div class="col-12 text-center"> <textarea cols="150" rows="5">${items_text}</textarea> </div> </div></div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script></body></html>`;

        let tab = window.open('about:blank', '_blank');
        tab.document.write(pageHtmlTemplate);
        tab.document.close();
    },
    toggleSelection(item) {
        let selected = (this.isSelected(item.sku))
            ? this.selected[item.sku] = false
            : this.selected[item.sku] = true;
        this.selectedData[item.sku] = item;
        item.element.style.backgroundColor = (selected)
            ? 'green'
            : 'white';
        item.element.style.color = (selected)
            ? 'white'
            : 'black';
    },
    registerClickHandler: () => {
        document.addEventListener("click", (e) => {
            if (e.target.parentElement.classList[0] !== 'image-cell') {
                return;
            }
            let x = e.target.parentElement.parentElement;
            SellerCenterJs_StockChecklist.handleSelect({
                element: x,
                sku: x.childNodes[1].innerText,
                image: x.childNodes[3].firstElementChild.src,
                name: x.childNodes[5].innerText,
                order: x.childNodes[7].innerText.replace('\n', ', '),
                quantity: x.childNodes[9].innerText,
            });
        });
    },
    run() {
        this.registerClickHandler();
    }
}
SellerCenterJs_StockChecklist.run();
