import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';

const allowedPriorities = ['Low', 'Medium', 'High'];
const allowedStatuses = ['Open', 'In Progress', 'Closed'];

/* ================= GET ALL TICKETS ================= */
export async function getTickets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const search = req.query.search as string | undefined;

    const filter: any = {};

    if (status && allowedStatuses.includes(status)) {
      filter.status = status;
    }

    if (priority && allowedPriorities.includes(priority)) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 }) // ✅ for "Recently Added Items"
      .exec();

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
}

/* ================= CREATE TICKET ================= */
export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { subject, description, priority, status } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required.',
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be Low, Medium, or High.',
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Open, In Progress, or Closed.',
      });
    }

    const ticket = await Ticket.create({
      subject,
      description,
      priority: priority ?? 'Low',
      status: status ?? 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket,
    });
  } catch (error) {
    next(error);
  }
}

/* ================= DELETE TICKET ================= */
export async function deleteTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket id.',
      });
    }

    const deleted = await Ticket.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}