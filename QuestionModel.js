import db from "./dbconfig.js";
import fs from "fs";
import json2csv from "json2csv";

const JSON2CSVParser = json2csv.Parser;

const table = "questionsdata";

export default class QuestionModel {
  static queueCount = 0;

  static updateRefCount(id, refCount) {
    console.log(`UPdarting Id = ${id}`);
    let query1 = `SELECT * FROM ${table} WHERE ID = ${id}`;
    this.queueCount++;
    return db.query(query1, (err, data) => {
      this.queueCount--;
      if (err) return console.log("DB ERROR : ", query1);
      if (!data || data.length === 0)
        return console.log("Question does not Exists!! ", query1);
      let query2 = `UPDATE ${table} SET numCount = ${refCount} WHERE ID = ${id}`;
      this.queueCount++;
      db.query(query2, (err, data) => {
        this.queueCount--;
        if (err) return console.log("DB ERROR : ", query2);
        console.log("DB success : ", query2);
      });
    });
  }

  static updateToDB({ uid, question, numUpvotes, numAnswers, refCount = 1 }) {
    let query = `UPDATE ${table} SET question = "${question}", numUpvotes = ${numUpvotes}, numAnswers = ${numAnswers}, 
    numCount = ${refCount} where id = ${uid}`;
    this.queueCount++;

    db.query(query, (err, data) => {
      this.queueCount--;
      if (err) return console.log("Database Error while updating : ", query);
      console.log("Database Updated Successfully!", query);
    });
  }

  static writeToDB({ uid, question, numUpvotes, numAnswers, refCount = 1 }) {
    let query1 = `SELECT * From ${table} where id = ${uid}`;
    this.queueCount++;
    db.query(query1, (err, data) => {
      this.queueCount--;
      if (err) return console.log("DB ERROR : ", query1);
      if (data.length > 0)
        return QuestionModel.updateToDB({
          uid: uid,
          question: question,
          numUpvotes: numUpvotes,
          numAnswers: numAnswers,
          refCount: refCount,
        });
      else {
        let query = `INSERT INTO ${table} VALUES (${uid},"${question}",${numUpvotes},${numAnswers},${refCount})`;
        this.queueCount++;
        db.query(query, (err, data) => {
          this.queueCount--;
          if (err) return console.log("Database Error while writing : ", query);
          console.log("Writing to db successful");
        });
      }
    });
  }

  static writeToCSV() {
    let query = `SELECT * FROM ${table}`;
    db.query(query, (err, data) => {
      if (err) return console.log(err);
      const json2csv = new JSON2CSVParser({ header: true });
      const csv = json2csv.parse(JSON.parse(JSON.stringify(data)));
      fs.writeFile("QuestionData.csv", csv, (err) => {
        if (err) return console.log(err);
        console.log("Written to csv!!");
      });
    });
  }
}
