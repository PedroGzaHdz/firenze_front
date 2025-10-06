
const categoryStyles = {
  "Community & Network": { bg: "bg-[var(--category-community)]", text: "text-[var(--category-community-text)]" },
  "Flavors & Ingredients": { bg: "bg-[var(--category-flavors)]", text: "text-[var(--category-flavors-text)]" },
  "PR & Marketing": { bg: "bg-[var(--category-pr)]", text: "text-[var(--category-pr-text)]" },
  "Event & Trade show": { bg: "bg-[var(--category-event)]", text: "text-[var(--category-event-text)]" },
  "Financing & Working Capital": {
    bg: "bg-[var(--category-financing)]",
    text: "text-[var(--category-financing-text)]",
  },
  Investor: { bg: "bg-[var(--category-investor)]", text: "text-[var(--category-investor-text)]" },
  "Co-Packer & Co-Manufacturer": { bg: "bg-[var(--category-copacker)]", text: "text-[var(--category-copacker-text)]" },
  "Logistics & Warehouse": { bg: "bg-[var(--category-logistics)]", text: "text-[var(--category-logistics-text)]" },
  "Legal services": { bg: "bg-[var(--category-legal)]", text: "text-[var(--category-legal-text)]" },
  "Branding & Packaging": { bg: "bg-[var(--category-branding)]", text: "text-[var(--category-branding-text)]" },
  "Accelerator & Incubator": {
    bg: "bg-[var(--category-accelerator)]",
    text: "text-[var(--category-accelerator-text)]",
  },
  "Equipment & Facility": { bg: "bg-[var(--category-equipment)]", text: "text-[var(--category-equipment-text)]" },
  "Retailer & Distributor": { bg: "bg-[var(--category-retailer)]", text: "text-[var(--category-retailer-text)]" },
  "Accounting & Tax": { bg: "bg-[var(--category-accounting)]", text: "text-[var(--category-accounting-text)]" },
  "Sales & Broker": { bg: "bg-[var(--category-sales)]", text: "text-[var(--category-sales-text)]" },
}

export function CategoryBadge({ category }) {
  const style = categoryStyles[category] || { bg: "bg-muted", text: "text-muted-foreground" }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
      {category}
    </span>
  )
}
