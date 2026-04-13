import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { currencies } from "../../utils/currency";

export default function CurrencySelector() {
  const { currency, changeCurrency } = useContext(CurrencyContext);

  return (
    <select
      value={currency}
      onChange={(e) => changeCurrency(e.target.value)}
      style={{
        padding: "6px",
        borderRadius: "6px"
      }}
    >
      {Object.keys(currencies).map((key) => (
        <option key={key} value={key}>
          {currencies[key].flag} {key}
        </option>
      ))}
    </select>
  );
}