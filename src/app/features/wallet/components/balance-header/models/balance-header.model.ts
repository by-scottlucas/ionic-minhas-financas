export interface BalanceSummaryItem {
  title: string;
  value: number;
  icon: string;
  isPositive: boolean;
}

export interface BalanceHeaderData {
  title: string;
  value: number;
  icon: string;
  items: BalanceSummaryItem[];
  isPositive: boolean;
}
