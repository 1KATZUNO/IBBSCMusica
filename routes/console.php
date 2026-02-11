<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('cultos:delete-expired')->hourly();
