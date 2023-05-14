import React, { useState } from "react";
import { Button, Input } from "reactstrap";
import { HiPencil } from "react-icons/hi";
import { ImBin } from "react-icons/im";

export default function SellTableContents({
  item,
  setError,
  tableList,
  setTableList,
}) {
  const [disable, setDisable] = useState(false);

  const handleQty = (val, item) => {
    setError("");

    if (!item.inStockQty) {
      return setError(`No stock available for product ${item.productID}. Kindly remove item from the list.`);
    }

    if (parseInt(val) > item.inStockQty) {
      return setError(`Not enough stock available for product ${item.productID}. Kindly reduce the quantity.`);
    }

    setTableList(
      tableList.map((p) => {
        if (p._id === item._id) {
          if (!val) {
            p.amount = 0;
          } else {
            p.soldQty = parseInt(val);
            p.amount = parseInt(val) * p.price;
          }
        }
        return p;
      })
    );
  };

  const handleEnter = (e, item) => {
    if(e.key === "-" || e.key === "+"){
        return setError("No signs allowed");
    }
    if (e.key === "Enter" && item.soldQty) {
      setDisable(true);
    }
  };
  return (
    <tr>
      <td>{item.productID}</td>
      <td>{item.name}</td>
      <td>{item.type}</td>
      <td>{item.brand}</td>
      <td>{item.price}</td>
      <td>
        <Input
          type="number"
          style={{ width: "5rem" }}
          onChange={(e) => handleQty(e.target.value, item)}
          onKeyDown={(e) => handleEnter(e, item)}
          disabled={disable}
          min="0"
        />
      </td>
      <td>{item.amount}</td>
      <td>
        <Button
          color="dark"
          outline
          size="sm"
          onClick={() => setDisable(!disable)}
        >
          <HiPencil color="green" />
        </Button>{" "}
        <Button
          color="dark"
          outline
          size="sm"
          onClick={() => {
            const updatedTable = tableList.filter((i) => i._id !== item._id);
            setTableList(updatedTable);
            setError("");
          }}
        >
          <ImBin color="red" />
        </Button>
      </td>
    </tr>
  );
}
