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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employees: Employee[] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const findEmployeeById = employees.find(
      (employee: Employee) => employee.id === +params.id
    );
    if (findEmployeeById) {
      return NextResponse.json(findEmployeeById);
    } else {
      return NextResponse.json({ message: "Không tìm thấy nhân viên" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tìm kiếm nhân viên" });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let employees: Employee[] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const employeeIndex = employees.findIndex(
      (employee: Employee) => employee.id === +params.id
    );

    if (employeeIndex !== -1) {
      employees.splice(employeeIndex, 1);
      fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
      return NextResponse.json({ message: "Xóa nhân viên thành công" });
    } else {
      return NextResponse.json({ message: "Không tìm thấy nhân viên" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi khi xóa nhân viên" });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updatedEmployee = await req.json();
    let employees: Employee[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const employeeIndex = employees.findIndex(
      (employee: Employee) => employee.id === +params.id
    );

    if (employeeIndex !== -1) {
      employees[employeeIndex] = {
        ...employees[employeeIndex],
        ...updatedEmployee,
      };
      fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
      return NextResponse.json({
        message: "Cập nhật thông tin nhân viên thành công",
        employee: employees[employeeIndex],
      });
    } else {
      return NextResponse.json({ message: "Không tìm thấy nhân viên" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật nhân viên" });
  }
}
