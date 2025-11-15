export function graph (destination, amount) {
    const demoTree = {
        address: destination || "rROOT...",
        amount: amount || 0,
        children: [
        {
            address: "rChild1...",
            amount: 10,
            children: [
            { address: "rGrand1...", amount: 3, children: [
                {
            address: "rChild1...",
            amount: 10, children: []
                }
            ] },
            { address: "rGrand2...", amount: 7, children: [] },
            ],
        },
        {
            address: "rChild2...",
            amount: 5,
            children: [],
        },
        ],
    };

    return demoTree
}

