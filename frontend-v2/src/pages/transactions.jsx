import React from 'react'
import { TransactionItem } from '../Dashboard/transactionIteam'
import { TransactionsList } from '../Dashboard/transactionList'
import { AppBar } from '../components/Appbar'

function Transactions() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div >
        <AppBar />
        <TransactionsList />
        <TransactionItem />
      </div>
    </div>
  )
}

export default Transactions
