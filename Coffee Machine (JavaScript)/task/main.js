// Use "input()" to input a line from the user
// Use "input(str)" to print some text before requesting input
// You will need this in the following stages
const CoffeeMachine = require('./CoffeeMachine')
const input = require('sync-input');

function main() {
    const machine = new CoffeeMachine(400, 540, 120, 9, 550);
    askAction(machine);
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
