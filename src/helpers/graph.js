// helpers/graph.js
export function graph({ hash, destination, amount, date }) {
    const demoTree = {
        address: destination || "rROOT...",
        amount: amount || 0,
        hash: hash || "ROOT_HASH",
        date: date || "ROOT_DATE",
        children: [
        {
            address: "rChild1...",
            amount: 10,
            hash: "HASH_CHILD_1",
            date: "2025-11-13T10:00:00Z",
            children: [
            {
                address: "rGrand1...",
                amount: 3,
                hash: "HASH_GRAND_1",
                date: "2025-11-13T11:00:00Z",
                children: [
                {
                    address: "rChild1...",
                    amount: 10,
                    hash: "HASH_CHILD_1_DUP",
                    date: "2025-11-13T12:00:00Z",
                    children: [],
                },
                ],
            },
            {
                address: "rGrand2...",
                amount: 7,
                hash: "HASH_GRAND_2",
                date: "2025-11-13T13:00:00Z",
                children: [],
            },
            ],
        },
        {
            address: "rChild2...",
            amount: 5,
            hash: "HASH_CHILD_2",
            date: "2025-11-13T14:00:00Z",
            children: [],
        },
        ],
    };

    return demoTree;
}
