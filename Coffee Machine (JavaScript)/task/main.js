// Use "input()" to input a line from the user
// Use "input(str)" to print some text before requesting input
// You will need this in the following stages

const input = require('sync-input');

function main() {
    const machine = new CoffeeMachine(400, 540, 120, 9, 550);
    askAction(machine);
}

class CoffeeMachine {
    useForBrew = {
        espresso: { index: 1, name: 'espresso', water: 250, beans: 16, cost: 4 },
        latte: { index: 2, name: 'latte', water: 350, milk: 75, beans: 20, cost: 7 },
        cappuccino: { index: 3, name: 'cappuccino', water: 200, milk: 100, beans: 12, cost: 6 },
    };

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

        if (this.#cups === 0) {
            issues.push('cups');
        }
        if (brewNeed.milk && this.#milk <= brewNeed.milk) {
            issues.push('milk');
        }
        if (brewNeed.water && this.#water <= brewNeed.water) {
            issues.push('water');
        }
        if (brewNeed.beans && this.#beans <= brewNeed.beans) {
            issues.push('beans');
        }
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
        if (brew.milk) {
            this.#milk = this.#milk - brew.milk;
        }
        if (brew.water) {
            this.#water = this.#water - brew.water;
        }
        if (brew.beans) {
            this.#beans = this.#beans - brew.beans;
        }
        this.#cups--;
        this.#money = this.#money + brew.cost;
    }

}

function getUserInput(prompt, validation) {
    let value;
    do {
        console.log(prompt);
        value = input().toLowerCase();
    } while (!validation(value))
    return value;
}

function handlePrintStateAction(machine) {
    console.log('♨️The coffee machine has now:');
    console.log(`🚰${machine.water} ml of water`);
    console.log(`🥛${machine.milk} ml of milk`);
    console.log(`🫘${machine.beans} g of coffee beans`);
    console.log(`🥤${machine.cups} disposable cups`);
    console.log(`💰\$${machine.money} of money`);
    console.log();
}

function handleBuyAction(machine) {
    const options =
        Object.values(machine.useForBrew)
            .map(brew => ` ${brew.index} - ${brew.name}`)
            .join(', ');
    let buyingNumber = getUserInput(
        `What do you want to buy?${options}:`,
        value => ['1', '2', '3', 'back'].includes(value)
    );
    if (buyingNumber === 'back') return;
    const buying = machine.getBrewNameByNumber(buyingNumber);
    const hasEnoughInventory = machine.hasInventoryForBrew(buying);
    if (hasEnoughInventory.success) {
        console.log('☕ I have enough resources, making you a coffee!')
        machine.makeCoffee(buying);
    } else {
        console.log(`Sorry, not enough ${hasEnoughInventory.issues.join(', ')}!`)
    }
}

function handleFillAction(machine) {
    const resources = [
        { name: 'water', prompt: '🚰Write how many ml of water you want to add:' },
        { name: 'milk', prompt: '🥛Write how many ml of milk you want to add:' },
        { name: 'beans', prompt: '🫘Write how many grams of coffee beans you want to add:' },
        { name: 'cups', prompt: '🥤Write how many disposable cups you want to add:' }
    ];

    resources
        .forEach(resource => {
            const amountToAdd = Number(getUserInput(
                resource.prompt,
                value => !isNaN(value) && value >= 0
            ));
            machine[resource.name] = machine[resource.name] + amountToAdd;
        });
}

function handleTakeMoneyAction(machine) {
    console.log(`💰I gave you ${machine.money}`);
    machine.money = 0;
}

function askAction(machine) {
    let action;
    do {
        handlePrintStateAction(machine);
        action = getUserInput(
            'How can I assist you? (buy, fill, take, remaining, exit):',
            value => ['buy', 'fill', 'take', 'remaining', 'exit'].includes(value)
        );
        switch (action) {
            case 'buy':
                handleBuyAction(machine);
                break;
            case 'fill':
                handleFillAction(machine);
                break;
            case 'take':
                handleTakeMoneyAction(machine);
                break;
            case 'remaining':
                handlePrintStateAction(machine);
                break;
            case 'exit':
                break;
        }
    } while (action !== 'exit');
}

main();
