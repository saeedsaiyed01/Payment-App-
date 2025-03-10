import React from 'react'
import { TransactionsList } from '../Dashboard/transactionList'
import { AppBar } from '../components/Appbar'

function Transactions() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div >
        <AppBar />
        <TransactionsList />
    
      </div>
    </div>
  )
}

export default Transactions
