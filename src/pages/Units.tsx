import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Building2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
/* BottomNav removed as it is handled by Layout */
import UnitCard, { Unit } from '@/components/UnitCard';
import { Input } from '@/components/ui/input';

// Mock units data
const mockUnits: Unit[] = [
  { id: '1', number: 'A1', tenantName: 'Mary Wanjiku', monthlyRent: 15000, arrears: 0, isOccupied: true },
  { id: '2', number: 'A2', tenantName: 'James Omondi', monthlyRent: 15000, arrears: 7500, isOccupied: true },
  { id: '3', number: 'A3', tenantName: 'Grace Akinyi', monthlyRent: 18000, arrears: 18000, isOccupied: true },
  { id: '4', number: 'A4', monthlyRent: 18000, arrears: 0, isOccupied: false },
  { id: '5', number: 'B1', tenantName: 'Peter Kamau', monthlyRent: 12000, arrears: 0, isOccupied: true },
  { id: '6', number: 'B2', tenantName: 'Lucy Njeri', monthlyRent: 12000, arrears: 0, isOccupied: true },
  { id: '7', number: 'B3', tenantName: 'David Mwangi', monthlyRent: 15000, arrears: 30000, isOccupied: true },
  { id: '8', number: 'B4', monthlyRent: 15000, arrears: 0, isOccupied: false },
  { id: '9', number: 'C1', tenantName: 'Sarah Atieno', monthlyRent: 20000, arrears: 0, isOccupied: true },
  { id: '10', number: 'C2', tenantName: 'John Kipchoge', monthlyRent: 20000, arrears: 10000, isOccupied: true },
  { id: '11', number: 'C3', monthlyRent: 20000, arrears: 0, isOccupied: false },
  { id: '12', number: 'C4', monthlyRent: 20000, arrears: 0, isOccupied: false },
];

const Units = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filter = searchParams.get('filter');

  let filteredUnits = mockUnits;

  // Apply filter
  if (filter === 'vacant') {
    filteredUnits = filteredUnits.filter(u => !u.isOccupied);
  } else if (filter === 'occupied') {
    filteredUnits = filteredUnits.filter(u => u.isOccupied);
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredUnits = filteredUnits.filter(u =>
      u.number.toLowerCase().includes(query) ||
      u.tenantName?.toLowerCase().includes(query)
    );
  }

  const occupiedCount = mockUnits.filter(u => u.isOccupied).length;
  const vacantCount = mockUnits.filter(u => !u.isOccupied).length;

  const handleUnitClick = (unit: Unit) => {
    navigate(`/units/${unit.id}`);
  };

  return (
    <div className="min-h-screen pb-20 bg-background/50">
      <div className="md:hidden">
        <PageHeader
          title="Units"
          subtitle={filter ? `Showing ${filter} units` : `${occupiedCount} occupied, ${vacantCount} vacant`}
        />
      </div>

      <div className="content-area max-w-7xl mx-auto p-4 md:p-8">
        <div className="hidden md:flex items-center justify-between mb-8">
           <div>
             <h1 className="text-3xl font-bold tracking-tight">Units Management</h1>
             <p className="text-muted-foreground">{filter ? `Showing ${filter} units` : `${occupiedCount} occupied, ${vacantCount} vacant`}</p>
           </div>
        </div>

        {/* Summary Cards and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 md:items-center">
            <div className="flex gap-3 flex-1 md:flex-none">
              <button
                onClick={() => navigate('/units?filter=occupied')}
                className={`flex-1 md:w-40 kpi-card flex items-center justify-center gap-2 py-3 px-4 ${filter === 'occupied' ? 'border-secondary ring-1 ring-secondary' : ''}`}
              >
                <Building2 size={18} className="text-success" />
                <div className="flex flex-col items-start leading-none">
                   <span className="font-semibold">{occupiedCount}</span>
                   <span className="text-xs text-muted-foreground">Occupied</span>
                </div>
              </button>
              <button
                onClick={() => navigate('/units?filter=vacant')}
                className={`flex-1 md:w-40 kpi-card flex items-center justify-center gap-2 py-3 px-4 ${filter === 'vacant' ? 'border-secondary ring-1 ring-secondary' : ''}`}
              >
                <div className="flex flex-col items-start leading-none">
                   <span className="font-semibold">{vacantCount}</span>
                   <span className="text-xs text-muted-foreground">Vacant</span>
                </div>
                <Building2 size={18} className="text-warning" />
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by unit number or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 w-full bg-card"
              />
            </div>
        </div>

        {/* Unit List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onClick={handleUnitClick}
            />
          ))}

          {filteredUnits.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No units found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Units;
