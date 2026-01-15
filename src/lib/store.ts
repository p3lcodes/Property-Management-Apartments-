// src/lib/store.ts

// 1. Define Data Types
export interface User {
    id: string;
    fullName: string;
    phone: string;
    role: 'landlord' | 'caretaker' | 'tenant';
    
    // Property/Unit Details
    propertyName?: string; // For landlords/caretakers/tenants
    unitNumber?: string;   // For tenants
    
    // Financials (For Tenants)
    rentAmount?: number;   // Monthly rent
    balance?: number;      // Current owing (positive) or overpaid (negative)
    
    // Auth
    pin: string;           
    status: 'active' | 'inactive';
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'rent' | 'expense';
    description: string;
    relatedUserId?: string; // e.g., Tenant ID
}

// 2. Initial "Seed" Data 
const SEED_DATA = {
    users: [
        // --- LANDLORD ---
        {
            id: 'landlord_1',
            fullName: 'Victor Mwangi Gichuru',
            phone: '0768141129',
            role: 'landlord',
            propertyName: 'Riverside Apartments, Ruiru',
            pin: '1234',
            status: 'active'
        },
        // --- CARETAKER ---
        {
            id: 'caretaker_1',
            fullName: 'Derrick Murage',
            phone: '0111270277',
            role: 'caretaker',
            propertyName: 'Riverside Apartments, Ruiru',
            pin: '1234',
            status: 'active'
        },
        // --- TENANTS (Specific Users for Testing) ---
        {
            id: 'tenant_f1',
            fullName: 'Guyo Halake',
            phone: '0768141129', // Testing number
            role: 'tenant',
            propertyName: 'Riverside Apartments, Ruiru',
            unitNumber: 'F1',
            rentAmount: 9500,
            balance: 0,
            pin: '1234',
            status: 'active'
        },
        {
            id: 'tenant_e3',
            fullName: 'Joseph Gitari',
            phone: '0111270277', // Testing number
            role: 'tenant',
            propertyName: 'Riverside Apartments, Ruiru',
            unitNumber: 'E3',
            rentAmount: 8000,
            balance: 0,
            pin: '1234',
            status: 'active'
        },
        // --- TENANTS (Fillers to populate the list - A Series) ---
        { id: 't_a2', fullName: 'Alice Kamau', phone: '0700123001', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'A2', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },
        { id: 't_a3', fullName: 'Brian Omondi', phone: '0700123002', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'A3', rentAmount: 8000, balance: 8000, pin: '1234', status: 'active' }, // Has Balance
        
        // --- B Series ---
        { id: 't_b1', fullName: 'Catherine Wanjiku', phone: '0700123003', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'B1', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },
        { id: 't_b2', fullName: 'David Njoroge', phone: '0700123004', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'B2', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },
        // B3 is Vacant (Not listed as a User)

        // --- C Series ---
        { id: 't_c1', fullName: 'Emmanuel Kipkorir', phone: '0700123005', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'C1', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },
        { id: 't_c2', fullName: 'Faith Chebet', phone: '0700123006', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'C2', rentAmount: 8000, balance: 500, pin: '1234', status: 'active' },
        { id: 't_c3', fullName: 'George Otieno', phone: '0700123007', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'C3', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },

        // --- D Series ---
        { id: 't_d1', fullName: 'Hellen Muthoni', phone: '0700123008', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'D1', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },
        { id: 't_d2', fullName: 'Ian Mwangi', phone: '0700123009', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'D2', rentAmount: 8000, balance: 16000, pin: '1234', status: 'active' }, // 2 Months Arrears

        // --- E Series ---
        { id: 't_e1', fullName: 'Jane Nduta', phone: '0700123010', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'E1', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },
        { id: 't_e2', fullName: 'Kevin Kimani', phone: '0700123011', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'E2', rentAmount: 8000, balance: 0, pin: '1234', status: 'active' },
        // E3 is Joseph (Above)

        // --- F Series (9.5k) ---
        // F1 is Guyo (Above)
        { id: 't_f2', fullName: 'Lucy Achieng', phone: '0700123012', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'F2', rentAmount: 9500, balance: 0, pin: '1234', status: 'active' },
        { id: 't_f3', fullName: 'Mike Odhiambo', phone: '0700123013', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'F3', rentAmount: 9500, balance: 0, pin: '1234', status: 'active' },
        { id: 't_f4', fullName: 'Nancy Wambui', phone: '0700123014', role: 'tenant', propertyName: 'Riverside Apartments', unitNumber: 'F4', rentAmount: 9500, balance: 0, pin: '1234', status: 'active' },

    ] as User[],
    transactions: [] as Transaction[]
};

// 3. The "Database" Engine
// Changed version to v2 to force a fresh load of the new SEED_DATA
const DB_KEY = 'p3l_property_db_v2';

export const db = {
    // Initialize DB if empty
    init: () => {
        if (!localStorage.getItem(DB_KEY)) {
            localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
        }
    },

    // Force Reset (Call this if you want to wipe data and load new SEED_DATA)
    reset: () => {
        localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
        window.location.reload();
    },

    // Generic Getter
    getData: () => {
        db.init(); // Ensure init
        try {
            return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
        } catch (e) {
            return SEED_DATA;
        }
    },

    // Generic Saver
    saveData: (data: any) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },

    // --- USER METHODS ---

    getUsers: (): User[] => {
        return db.getData().users || [];
    },

    getTenants: (): User[] => {
        return db.getUsers().filter((u: User) => u.role === 'tenant');
    },

    getUserByPhone: (phone: string): User | undefined => {
        const users = db.getUsers();
        return users.find((u: User) => u.phone === phone);
    },

    addUser: (user: User) => {
        const data = db.getData();
        if (!data.users) data.users = [];
        // Ensure ID is unique if not provided
        if(!user.id) user.id = Date.now().toString();
        
        data.users.push(user);
        db.saveData(data);
    },

    updateUser: (updatedUser: User) => {
        const data = db.getData();
        data.users = data.users.map((u: User) => u.id === updatedUser.id ? updatedUser : u);
        db.saveData(data);
    },

    deleteUser: (userId: string) => {
        const data = db.getData();
        data.users = data.users.filter((u: User) => u.id !== userId);
        db.saveData(data);
    }
};
