class CoffeeMachine {
    #water;
    #milk;
    #beans;
    #cups;
    #money;
    constructor(water, milk, beans, cups, money) {
        this.#water = water;
        this.#milk = milk;
        this.#beans = beans;
        this.#cups = cups;
        this.#money = money;
    }

    useForBrew = {
        espresso: { index: 1, name: 'espresso', water: 250, beans: 16, cost: 4 },
        latte: { index: 2, name: 'latte', water: 350, milk: 75, beans: 20, cost: 7 },
        cappuccino: { index: 3, name: 'cappuccino', water: 200, milk: 100, beans: 12, cost: 6 },
    };

    getBrewNameByNumber(number) {
        const brew =
            Object.values(this.useForBrew)
                .find(brew => brew.index === parseInt(number));
        if (brew) {
            return brew.name;
        }
        console.warn('Invalid brew type');
    }

    hasInventoryForBrew(type) {
        let brewNeed = this.useForBrew[type];
        let issues = [];
        if (!brewNeed) {
            return {
                success: false,
                issues: ['Invalid Type of brew']
            }
        }

        if (this.#cups === 0)
            issues.push('cups');
        if (brewNeed.milk && this.#milk <= brewNeed.milk)
            issues.push('milk');
        if (brewNeed.water && this.#water <= brewNeed.water)
            issues.push('water');
        if (brewNeed.beans && this.#beans <= brewNeed.beans)
            issues.push('beans');

        if (issues.length) {
            return {
                success: false,
                issues: issues
            }
        }
        return {
            success: true,
            issues: []
        }
    }

    makeCoffee(type) {
        const brew = this.useForBrew[type];
        if (brew.milk)
            this.#milk = this.#milk - brew.milk;
        if (brew.water)
            this.#water = this.#water - brew.water;
        if (brew.beans)
            this.#beans = this.#beans - brew.beans;
        this.#cups--;
        this.#money = this.#money + brew.cost;
    }

    // Setters and Getters
    get water() {
        return this.#water;
    }

    set water(value) {
        this.#water = value;
    }

    get milk() {
        return this.#milk;
    }

    set milk(value) {
        this.#milk = value;
    }

    get beans() {
        return this.#beans;
    }

    set beans(value) {
        this.#beans = value;
    }

    get cups() {
        return this.#cups;
    }

    set cups(value) {
        this.#cups = value;
    }

    get money() {
        return this.#money;
    }

    set money(value) {
        this.#money = value;
    }
}

module.exports = CoffeeMachine;