import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

interface Employee {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}

const filePath = path.join(process.cwd(), "database", "employees.json");

function readEmployeesFromFile(): Employee[] {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeEmployeesToFile(employees: Employee[]) {
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emailQuery = searchParams.get("email")?.toLowerCase();

  try {
    const employees = readEmployeesFromFile();

    if (emailQuery) {
      const matchingEmployee = employees.find(
        (employee) => employee.email.toLowerCase() === emailQuery
      );
      if (matchingEmployee) {
        return NextResponse.json(matchingEmployee);
      } else {
        return NextResponse.json({
          message: `Không tìm thấy nhân viên nào với email: ${emailQuery}`,
        });
      }
    }

    return NextResponse.json({ employees });
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi khi đọc dữ liệu" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newEmployee: Employee = await req.json();
    const employees = readEmployeesFromFile();

    const newId =
      employees.length > 0
        ? Math.max(...employees.map((emp) => emp.id)) + 1
        : 1;
    const newEmployeeWithId = { ...newEmployee, id: newId };

    employees.push(newEmployeeWithId);
    writeEmployeesToFile(employees);

    return NextResponse.json({
      message: "Thêm mới thông tin nhân viên thành công",
      employee: newEmployeeWithId,
    });
  } catch (error) {
    return NextResponse.json({ message: "Đã xảy ra lỗi khi thêm nhân viên" });
  }
}
