function codProduct(param1: number, param2: number): string {
    return Math.floor(param1 + Math.random() * param2).toString();
}

export default codProduct;