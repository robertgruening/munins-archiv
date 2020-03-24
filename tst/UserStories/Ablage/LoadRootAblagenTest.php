<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../src/UserStories/Ablage/LoadRootAblagen.php");

final class LoadRootAblagenTest extends TestCase
{
    public function testLoadRootAblagen()
    {
        $loadRootAblagen = new LoadRootAblagen();

        $this->assertTrue($loadRootAblagen->run());
        $this->assertCount(2, $loadRootAblagen->getRootAblagen());
        $this->assertInstanceOf(Ablage::class, $loadRootAblagen->getRootAblagen()[0]);
    }
}