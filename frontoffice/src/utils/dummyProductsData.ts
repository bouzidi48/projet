import { Product } from "../types/product";


export const dummyProducts: Product[] = [
    {
        id: 1,
        nameProduct: "JUPE MIDI BOHO",
        description: "Jupe midi fluide à taille élastique, avec doublure ton sur ton. Disponible en plusieurs couleurs.",
        price: 49.99,
        createdate: "2024-08-20T10:00:00.000Z",
        updatedate: null,
        colors: [
            {
                id: 1,
                nameCouleur: "White",
                createdate: "2024-08-20T10:00:00.000Z",
                updatedate: null,
                images: [
                    {
                        id: 1,
                        UrlImage: "https://static.e-stradivarius.net/5/photos4/2024/I/0/1/p/1270/458/003/61/1270458003_1_1_1.jpg",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null
                    }
                ],
                sizes: [
                    {
                        id: 1,
                        typeSize: "S",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 50
                    },
                    {
                        id: 2,
                        typeSize: "M",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 100
                    },
                    {
                        id: 3,
                        typeSize: "L",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 75
                    }
                ]
            },
            {
                id: 2,
                nameCouleur: "Black",
                createdate: "2024-08-20T10:00:00.000Z",
                updatedate: null,
                images: [
                    {
                        id: 3,
                        UrlImage: "https://static.e-stradivarius.net/5/photos4/2024/I/0/1/p/1270/458/001/1270458001_1_1_1.jpg?t=1720016369298",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null
                    },
                    {
                        id: 4,
                        UrlImage: "https://static.e-stradivarius.net/5/photos4/2024/I/0/1/p/1270/458/001/1270458001_2_3_1.jpg",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null
                    }
                ],
                sizes: [
                    {
                        id: 4,
                        typeSize: "S",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 40
                    },
                    {
                        id: 5,
                        typeSize: "M",
                        createdate: "2024-08-20T10:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 80
                    }
                ]
            }
        ],
        category: {
            id: 1,
            nameCategory: "Jupes",
            description: "Comfortable and stylish Jupes.",
            createdAt: "2024-08-20T09:00:00.000Z",
            updatedAt: null
        }
    },
    {
        id: 2,
        nameProduct: "ROBE MIDI FRONCÉE",
        description: "A beautiful floral dress perfect for summer days.",
        price: 89.99,
        createdate: "2024-08-20T11:00:00.000Z",
        updatedate: null,
        colors: [
            {
                id: 3,
                nameCouleur: "white",
                createdate: "2024-08-20T11:00:00.000Z",
                updatedate: null,
                images: [
                    {
                        id: 5,
                        UrlImage: "https://static.e-stradivarius.net/5/photos4/2024/I/0/1/p/6362/527/660/03/6362527660_2_10_1.jpg",
                        createdate: "2024-08-20T11:00:00.000Z",
                        updatedate: null
                    },
                    {
                        id: 6,
                        UrlImage: "https://static.e-stradivarius.net/5/photos4/2024/I/0/1/p/6362/527/660/03/6362527660_2_3_1.jpg",
                        createdate: "2024-08-20T11:00:00.000Z",
                        updatedate: null
                    }
                ],
                sizes: [
                    {
                        id: 7,
                        typeSize: "S",
                        createdate: "2024-08-20T11:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 30
                    },
                    {
                        id: 8,
                        typeSize: "M",
                        createdate: "2024-08-20T11:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 50
                    }
                ]
            },{
                id: 4,
                nameCouleur: "black",
                createdate: "2024-08-20T11:00:00.000Z",
                updatedate: null,
                images: [
                    {
                        id: 7,
                        UrlImage: "https://static.e-stradivarius.net/5/photos4/2024/I/0/1/p/6362/527/001/6362527001_1_1_1.jpg",
                        createdate: "2024-08-20T11:00:00.000Z",
                        updatedate: null
                    }
                ],
                sizes: [
                    {
                        id: 8,
                        typeSize: "S",
                        createdate: "2024-08-20T11:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 30
                    },
                    {
                        id: 9,
                        typeSize: "M",
                        createdate: "2024-08-20T11:00:00.000Z",
                        updatedate: null,
                        stockQuantity: 50
                    }
                ]
            }
        ],
        category: {
            id: 2,
            nameCategory: "Women's Clothing",
            description: "Stylish and comfortable clothing for women.",
            createdAt: "2024-08-20T09:00:00.000Z",
            updatedAt: null
        }
    }
];

export const getDummyProductById = (id: number): Product | undefined => {
    return dummyProducts.find(product => product.id === id);
};