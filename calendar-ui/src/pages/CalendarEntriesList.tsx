import { EventTable } from "../components/EventTable";
import { CalendarFilters } from "../components/CalendarFilters";
import { Input, Button } from "@fluentui/react-components"; 
import { Add24Regular } from "@fluentui/react-icons";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const CalendarEntriesList = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleFilterUpdate = (filters: ColumnFiltersState) => {
    setColumnFilters(filters);
  };

  useEffect(() => {
 },[columnFilters]);

  return (
    <div>
      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#ffffff",
              }}
            >
              {/* Left: Title and Search */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <Input
                  placeholder="Enter keyword, activity ID, or location"
                  style={{ width: "320px" }}
                />
              </div>
        
              {/* Right: Icons + Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div>
                    <Button
                      appearance="primary"
                      onClick={() => window.open("/entry-form", "_blank")}
                      icon={<Add24Regular />}
                    >
                      Add new
                    </Button>
                </div>
              </div>
            </header>

        {/* Content */}
        <div style={{ padding: "24px", overflowY: "auto", backgroundColor: "#fafafa", flex: 1 }}>
          <CalendarFilters 
            filters={columnFilters}
            onFiltersChanged={handleFilterUpdate}
          />
          <EventTable 
            filters={columnFilters}
            
          />
        </div>
      </div>
    </div>
  );
};
